// components/CreditCardModal.tsx
"use client";

import { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

export default function CreditCardModal() {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setCardData((prev) => ({ ...prev, focus: e.target.name }));
  };

  const handleSubmit = () => {
    // You can hook this to a payment API
    localStorage.setItem("card", JSON.stringify(cardData));
    console.log("Submitting card data:", cardData);
  };

  const validation = () => {
    return (
      cardData.number.length != 16 ||
      cardData.cvc.length != 3 ||
      cardData.expiry.length != 4 ||
      cardData.name.length == 0
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Credit Card</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Credit Card</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <Cards
            number={cardData.number}
            name={cardData.name}
            expiry={cardData.expiry}
            cvc={cardData.cvc}
          />

          <Input
            type="number"
            name="number"
            placeholder="Card Number"
            value={cardData.number}
            onChange={handleInputChange}
            onFocus={handleFocus}
            maxLength={16}
            required
          />
          <Input
            type="text"
            name="name"
            placeholder="Name on Card"
            value={cardData.name}
            onChange={handleInputChange}
            onFocus={handleFocus}
            required
          />
          <div className="flex space-x-2 w-full">
            <Input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={cardData.expiry}
              onChange={handleInputChange}
              onFocus={handleFocus}
              className="w-1/2"
              maxLength={4}
            />
            <Input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={cardData.cvc}
              onChange={handleInputChange}
              onFocus={handleFocus}
              className="w-1/2"
              maxLength={3}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose onClick={handleSubmit} disabled={validation()}>
            Save Card
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
