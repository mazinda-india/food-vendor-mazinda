"use client";

import { useState } from "react";
import OvalLoader from "@/components/OvalLoader";
import QRCode from "qrcode"; // Import qrcode library
import Cookies from "js-cookie";
import useSWR from "swr";
import axios from "axios";

const VendorOrdersPage = () => {
  const [saveStatusLoading, setSaveStatusLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [qrCodeImages, setQRCodeImages] = useState({}); // Store QR code images

  // Check if vendorToken is not present, then redirect to the login page
  const vendorToken = Cookies.get("vendor_token");

  const generateQRCode = (paymentLink, orderId) => {
    QRCode.toDataURL(paymentLink, (error, dataUrl) => {
      if (error) {
        console.error(error);
      } else {
        setQRCodeImages((prevImages) => ({
          ...prevImages,
          [orderId]: dataUrl,
        }));
      }
    });
  };

  const fetchUser = async (userId) => {
    const response = await axios.post("/api/user/fetchuserbyid", {
      user_id: userId,
    });
    return response.data;
  };

  const orderFetcher = async () => {
    try {
      const response = await axios.post(`/api/order/fetchvendororders`, {
        vendor_token: vendorToken,
      });

      const ordersWithUsers = await Promise.all(
        response.data.orders.map(async (order) => {
          const userInfo = await fetchUser(order.userId);
          return {
            ...order,
            userName: userInfo.user.name,
          };
        })
      );

      // Generate QR code for each order's payment link
      ordersWithUsers.forEach((order) => {
        generateQRCode(order.paymentLink, order._id);
      });

      //   return { orders: ordersWithUsers };

      // Filter orders that are not delivered
      const deliveredOrders = ordersWithUsers.filter(
        (order) => order.status == "Delivered"
      );

      console.log(deliveredOrders);

      return { orders: deliveredOrders };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // Rethrow the error to be handled by SWR
    }
  };

  const { data, error } = useSWR("orders", orderFetcher);

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
    <div className="container mx-auto p-5 md:w-1/2">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Delivered Orders
      </h1>
      {data.orders.toReversed().map((order) => (
        <div
          key={order._id}
          className="bg-white shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-lg mb-10 px-4 pt-4 pb-1 cursor-pointer"
          onClick={() => toggleExpand(order._id)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Order ID:{" "}
              <span className="text-sm font-normal text-gray-600">
                {order._id}
              </span>
            </h2>
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

            <div>
              <p className="text-gray-600 ml-4">
                Hostel: {order.address.hostel}
              </p>
              <p className="text-gray-600 ml-4">
                Campus: {order.address.campus}
              </p>
            </div>
          </div>

          {expandedOrderId === order._id && (
            <div className="mt-4">
              <p className="text-gray-600">
                <strong>User:</strong> {order.userName}
              </p>
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

          {/* Display the QR code */}
          {expandedOrderId === order._id && (
            <div className="mt-2">
              <h2 className="font-bold text-gray-600 text-lg">
                QR for payment
              </h2>
              <img src={qrCodeImages[order._id]} alt="Payment QR Code" />
            </div>
          )}

          <div className="flex items-center text-gray-500 justify-center mt-2 scale-[0.8]">
            View details
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorOrdersPage;
