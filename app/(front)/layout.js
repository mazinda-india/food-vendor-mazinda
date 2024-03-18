import NavbarVendor from "@/components/NavbarVendor";

export const metadata = {
  title: "Food Vendor - Mazinda",
  description: "Food Vendor - Mazinda",
};

export default function VendorLayout({ children }) {
  return (
    <>
      <NavbarVendor />
      {children}
    </>
  );
}
