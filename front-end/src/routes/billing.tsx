import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";
import { useState } from "react";
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

export const Route = createFileRoute("/billing")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentPlan, setCurrentPlan] = useState("Premium");

  const billingHistory = [
    {
      id: "INV-001",
      date: "2024-01-15",
      amount: "$29.00",
      status: "Paid",
      description: "Premium Plan - Monthly",
    },
    {
      id: "INV-002",
      date: "2023-12-15",
      amount: "$29.00",
      status: "Paid",
      description: "Premium Plan - Monthly",
    },
    {
      id: "INV-003",
      date: "2023-11-15",
      amount: "$29.00",
      status: "Paid",
      description: "Premium Plan - Monthly",
    },
    {
      id: "INV-004",
      date: "2023-10-15",
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
    {
      id: "pm_2",
      type: "Mastercard",
      last4: "8888",
      expiry: "09/26",
      isDefault: false,
    },
  ];
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
                      February 15, 2024
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Billing cycle</p>
                    <p className="text-sm text-muted-foreground">Monthly</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Cancel Subscription</Button>
              </CardFooter>
            </Card>

            {/* Usage Summary */}
            <Card>
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
            </Card>
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
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
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
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Main Street" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" defaultValue="94105" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Address</Button>
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
                          <Button variant="outline" size="sm">
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
                  <p className="text-sm">• 1,000 API calls/month</p>
                  <p className="text-sm">• 1 GB storage</p>
                  <p className="text-sm">• 1 team member</p>
                  <p className="text-sm">• Email support</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={currentPlan === "Free"}
                  >
                    {currentPlan === "Free" ? "Current Plan" : "Downgrade"}
                  </Button>
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
                  <p className="text-sm">• 10,000 API calls/month</p>
                  <p className="text-sm">• 5 GB storage</p>
                  <p className="text-sm">• 5 team members</p>
                  <p className="text-sm">• Priority support</p>
                  <p className="text-sm">• Advanced analytics</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large-scale operations</CardDescription>
                  <div className="text-3xl font-bold">
                    $99<span className="text-sm font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Unlimited API calls</p>
                  <p className="text-sm">• 50 GB storage</p>
                  <p className="text-sm">• Unlimited team members</p>
                  <p className="text-sm">• 24/7 phone support</p>
                  <p className="text-sm">• Custom integrations</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Upgrade to Enterprise</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
