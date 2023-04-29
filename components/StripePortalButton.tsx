const BILLING_PORTAL_REDIRECT_ENDPOINT = "/api/v1/stripe/portal";

const StripePortalButton: React.FC<{
  customerId: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ children, customerId, className }) => {
  return (
    <form
      method="POST"
      action={BILLING_PORTAL_REDIRECT_ENDPOINT}
      className={className}
    >
      <input type={"hidden"} name={"customerId"} value={customerId} />
      <button className="flex items-center justify-center gap-x-2 rounded-lg bg-black py-2 px-4 text-center font-medium text-white duration-150 hover:bg-black/80 hover:shadow-none">
        {children}
      </button>
    </form>
  );
};

export default StripePortalButton;
