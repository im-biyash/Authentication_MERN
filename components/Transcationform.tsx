"use client";
import React, { useState } from "react";
import axios from "axios"; // Add axios for making HTTP requests
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
const Transcationform = () => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!amount || !type || !description || !date) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Log the token to verify

      if (!token) {
        setError("You must be logged in to add a transaction");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/transaction/add",
        { amount, type, description, date },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
          },
        }
      );

      console.log("Response Data:", response.data); // Log response data

      setSuccess(response.data.msg || "Transaction added successfully");

      // Clear form fields
      setAmount("");
      setType("");
      setDescription("");
      setDate("");
    } catch (error: any) {
      console.error(
        "Add Transaction Error:",
        error.response?.data || error.message
      ); // Log error
      setError(error.response?.data?.msg || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleShowAllTransactions = () => {
    route.push("/transcationlogs");
  };

  return (
    <div>
      <Card className="w-80 h-[550px] rounded-xl border-black-300 p-2">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Transaction Form
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <h1>Total Amount</h1>
            <Input
              placeholder="Enter amount"
              className="border-gray-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </CardContent>
          <CardContent>
            <h1>Type</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-full border border-gray-500 rounded">
                  <Input
                    placeholder="Select type"
                    className="cursor-pointer border-none"
                    value={type}
                    readOnly
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setType("expense")}>
                  Expense
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setType("income")}>
                  Income
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setType("investment")}>
                  Investment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
          <CardContent>
            <h1>Description</h1>
            <Input
              placeholder="Purpose"
              className="border-gray-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardContent>
          <CardContent>
            <h1>Date</h1>
            <Input
              placeholder="Enter date"
              type="date"
              className="border-gray-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Transaction"}
            </Button>
            <Button
              type="button"
              className="w-full"
              onClick={handleShowAllTransactions}
            >
              Show All Transactions
            </Button>
          </CardFooter>
        </form>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
      </Card>
    </div>
  );
};

export default Transcationform;