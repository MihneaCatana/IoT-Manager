import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, Plus, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import CreditCardModal from "@/components/ui/credit-card-modal";
import axios from "axios";
import { UserProfile } from "@/interfaces/user";
import { ToastContainer, toast } from "react-toastify";

export const Route = createFileRoute("/billing")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentPlan, setCurrentPlan] = useState("Premium");
  const [profile, setProfile] = useState<UserProfile>({
    username: "johndoe",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    location: "San Francisco, CA",
    profileImage: "/placeholder.svg?height=120&width=120",
  });

  const billingHistory = [
    {
      id: "INV-001",
      date: "2024-06-15",
      amount: "$29.00",
      status: "Paid",
      description: "Premium Plan - Monthly",
    },
  ];

  const paymentMethods = [
    {
      id: "pm_1",
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
  ];

  const handleDownload = (invoice: Object) => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(invoice), 10, 10);
    doc.save("real-pdf.pdf");
  };

  useEffect(() => {
    const id = localStorage.getItem("id");

    axios.get(`http://localhost:8080/api/user/${id}`).then((res) => {
      setProfile({
        ...res.data,
        profileImage: "/placeholder.svg?height=120&width=120",
      });
    });
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving profile:", profile);
    const id = localStorage.getItem("id");
    axios
      .put(`http://localhost:8080/api/user/${id}`, profile)
      .then(() => {
        toast.success("Billing has been updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Billing couldn't be updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Billing & Subscription</h1>
            <p className="text-muted-foreground">
              Manage your subscription, payment methods, and billing history
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="billing-history">Billing History</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Current Subscription */}
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>
                  Your current plan and usage details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {currentPlan} Plan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      $29.00 per month
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Next billing date</p>
                    <p className="text-sm text-muted-foreground">
                      July 15, 2024
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Billing cycle</p>
                    <p className="text-sm text-muted-foreground">Monthly</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                {/* <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Cancel Subscription</Button> */}
              </CardFooter>
            </Card>

            {/* Usage Summary */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
                <CardDescription>Your current usage and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Calls</span>
                    <span>8,432 / 10,000</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "84%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span>2.1 GB / 5 GB</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "42%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Team Members</span>
                    <span>3 / 5</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </TabsContent>

          <TabsContent value="payment-methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {method.type} ending in {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiry}
                        </p>
                      </div>
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <CreditCardModal />
              </CardFooter>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>
                  Update your billing address information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Country</Label>
                    <Input
                      id="state"
                      value={profile.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={profile.zip}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Update Address</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="billing-history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.id}
                        </TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              invoice.status === "Paid"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(invoice)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-3xl font-bold">
                    $0<span className="text-sm font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    • 1 Space (e.g., home lab or test site)
                  </p>
                  <p className="text-sm">• Manage up to 5 IoT devices</p>
                  <p className="text-sm">• 1 team member</p>
                  <p className="text-sm">• Basic email support</p>
                </CardContent>
                <CardFooter>
                  {/* <Button
                    variant="outline"
                    className="w-full"
                    disabled={currentPlan === "Free"}
                  >
                    {currentPlan === "Free" ? "Current Plan" : "Downgrade"}
                  </Button> */}
                </CardFooter>
              </Card>

              {/* Premium Plan */}
              <Card className="relative border-primary">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge>Current Plan</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>Best for growing businesses</CardDescription>
                  <div className="text-3xl font-bold">
                    $29<span className="text-sm font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    • 5 Spaces (e.g., different locations, departments, or use
                    cases)
                  </p>
                  <p className="text-sm">• Manage up to 50 IoT devices</p>
                  <p className="text-sm">• 5 GB storage</p>
                  <p className="text-sm">• Up to 5 team members</p>
                  <p className="text-sm">• Priority email support</p>
                  <p className="text-sm">
                    • Device analytics & health monitoring
                  </p>
                </CardContent>
                <CardFooter>
                  {/* <Button className="w-full" disabled>
                    Current Plan
                  </Button> */}
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large-scale operations</CardDescription>
                  <div className="text-3xl font-bold">
                    Custom<span className="text-sm font-normal"></span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Unlimited Spaces</p>
                  <p className="text-sm">• Unlimited IoT devices</p>
                  <p className="text-sm">• 50 GB+ storage (expandable)</p>
                  <p className="text-sm">• Unlimited team members</p>
                  <p className="text-sm">• 24/7 phone & email support</p>
                  <p className="text-sm">
                    • Custom integrations (e.g., ERP, analytics platforms)
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Upgrade to Enterprise</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <ToastContainer />
    </Layout>
  );
}
