import CustomerModal from "@/components/modals/customers/customer-modal";
import AddItemModal from "@/components/modals/sku/add-item-modal";
import SkuModal from "@/components/modals/sku/sku-modal";

const ModalProvider = () => {
  return (
    <>
      <CustomerModal />
      <SkuModal />
    </>
  );
};

export default ModalProvider;
