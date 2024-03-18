"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";

export default function Ready({ id }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function getInitial() {
      try {
        const response = await axios.post("/api/order/update-order-ready", {
          id,
        });

        if (response.data.success) {
          setIsReady(response.data.isReady);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getInitial();
  }, []);
  const handleSwitchToggle = async () => {
    try {
      setIsReady(!isReady);

      const res = await axios.put("/api/order/update-order-ready", {
        isReady: !isReady,
        id: id,
      });
      if (res.data.success) {
        alert("Updated");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Error toggling :", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch checked={isReady} onCheckedChange={handleSwitchToggle} />
      <Label htmlFor="ready-mode">Ready?</Label>
    </div>
  );
}
