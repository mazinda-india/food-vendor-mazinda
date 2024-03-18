"use client";

import { useState } from "react";
import OvalLoader from "@/components/OvalLoader";
import Cookies from "js-cookie";
import useSWR from "swr";
import axios from "axios";
import Ready from "@/components/Ready";

const VendorOrders = ({ filter }) => {
  const [saveStatusLoading, setSaveStatusLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  const vendorToken = Cookies.get("vendor_token");

  const orderFetcher = async () => {
    try {
      const { data } = await axios.post(`/api/order/fetchvendororders`, {
        vendor_token: vendorToken,
      });

      const filteredOrders = data.orders.filter((order) => {
        if (filter === "not-delivered") {
          return order.status !== "Delivered";
        } else {
          return order.status === "Delivered";
        }
      });

      return { orders: filteredOrders };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  const { data, error } = useSWR(["orders", filter], orderFetcher);

  if (error) return "An error has occurred";

  if (!data) return <OvalLoader />;

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prevOrderId) =>
      prevOrderId === orderId ? null : orderId
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus({ ...selectedStatus, [orderId]: newStatus });
  };

  const saveStatusToDatabase = async (orderId) => {
    setSaveStatusLoading(true);
    const newStatus = selectedStatus[orderId];
    try {
      const response = await axios.put(`/api/order/updateorderstatus`, {
        orderId,
        status: newStatus,
      });

      if (!response.data.success) {
        alert("Error while updating order status");
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      alert("Error while updating order status");
    }
    setSaveStatusLoading(false);
  };

  return (
    <div className="mx-auto">
      {data.orders.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No current orders.</p>
      ) : (
        data.orders.toReversed().map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-lg mb-10 px-4 pt-4 pb-1 cursor-pointer"
            onClick={() => toggleExpand(order._id)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Order ID:{" "}
                <span className="text-sm font-normal text-gray-600">
                  {order._id.slice(-4)}
                </span>
              </h2>

              <Ready id={order._id} />
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-green-600">
                ₹{order.amount.toFixed(2)}{" "}
                <span className="text-gray-600">[{order.paymentMethod}]</span>
              </p>
              <p className="text-gray-600 text-sm">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <label className="block text-gray-600 mt-2">
                  <strong>Change Status:</strong>
                </label>
                <div className="flex items-center">
                  <select
                    className="p-1 rounded-md outline outline-gray-300"
                    value={selectedStatus[order._id] || order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="Processing">Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 ml-2 rounded-md"
                    onClick={() => saveStatusToDatabase(order._id)}
                  >
                    {saveStatusLoading ? <OvalLoader /> : "Save"}
                  </button>
                </div>
              </div>

              {/* <div>
                <p className="text-gray-600 ml-4">
                  Hostel: {order.address.hostel}
                </p>
                <p className="text-gray-600 ml-4">
                  Campus: {order.address.campus}
                </p>
              </div> */}

              <span>OTP: {order.vendorOTP}</span>
            </div>

            {expandedOrderId === order._id && (
              <div className="mt-4">
                <p className="text-gray-600">
                  <strong>Delivery Address:</strong>
                </p>
                <p className="text-gray-600 ml-4">
                  Hostel: {order.address.hostel}
                </p>
                <p className="text-gray-600 ml-4">
                  Campus: {order.address.campus}
                </p>
                <p className="text-gray-600 ml-4">
                  Phone Number: {order.address.phoneNumber}
                </p>
                <p className="text-gray-600">
                  <strong>Instructions:</strong> {order.address.instructions}
                </p>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-600">
                    Products Ordered:
                  </h3>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="p-2 border border-gray-300">
                          Product Name
                        </th>
                        <th className="p-2 border border-gray-300">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(order.products).map((productName) => (
                        <tr key={productName}>
                          <td className="p-2 border border-gray-300">
                            {productName}
                          </td>
                          <td className="p-2 border border-gray-300 flex justify-center">
                            {order.products[productName].quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center text-gray-500 justify-center mt-2 scale-[0.8]">
              View details
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorOrders;
