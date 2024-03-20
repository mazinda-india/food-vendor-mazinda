"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

import axios from "axios";
import { Button } from "@/components/ui/button";
import VendorOrders from "@/components/utility/VendorOrders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Menu = () => {
  const [storeName, setStoreName] = useState("");
  const [storeOpen, setStoreOpen] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await fetch("/api/vendor/me", {
          cache: "no-cache",
        });
        const data = await response.json();
        const vendorToken = data.decoded;
        const number = vendorToken.number;

        const vendorResponse = await axios.post(`/api/vendor/fetchvendor`, {
          number,
        });
        const json = vendorResponse.data;

        if (json.success) {
          setStoreOpen(json.vendor.openStatus);
          setStoreName(json.vendor.name);
        } else {
          console.error("Failed to fetch menu:", json.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        // setFetchingData(false);
      }
    };

    // setFetchingData(true);
    fetchVendorData();
  }, []);

  const handleToggle = async () => {
    try {
      const vendorResponse = await fetch("/api/vendor/me", {
        cache: "no-cache",
      });
      const data = await vendorResponse.json();
      const vendorToken = data.decoded;
      const number = vendorToken.number;

      const response = await axios.put(`/api/vendor/togglestore`, { number });

      const json = response.data;

      if (json.success) {
        setStoreOpen(!storeOpen);
        toast.success(json.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (err) {
      console.error("An error occurred:", err.message);
    }
  };

  return (
    <div className="md:w-1/2 mx-auto p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-center">Welcome '{storeName}'</h2>

        <div className="flex items-center space-x-2">
          <Label htmlFor="open-mode">
            {storeOpen ? (
              <span className="bg-green-100 text-green-600 text-sm py-1 px-3 rounded-xl">
                Shop Open
              </span>
            ) : (
              <span className="bg-yellow-100 text-yellow-600 text-sm py-1 px-3 rounded-xl">
                Shop Closed
              </span>
            )}
          </Label>
          <Switch checked={storeOpen} onCheckedChange={handleToggle} />
        </div>
      </div>

      <div className="flex my-4 gap-2">
        <Link href="/menu">
          <Button variant="secondary">View / Edit Menu</Button>
        </Link>
      </div>

      <div>
        <Tabs defaultValue="not-delivered">
          <TabsList>
            <TabsTrigger value="not-delivered">Current Orders</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          <TabsContent value="not-delivered">
            {" "}
            <VendorOrders filter="not-delivered" />
          </TabsContent>
          <TabsContent value="delivered">
            {" "}
            <VendorOrders filter="delivered" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Menu;
