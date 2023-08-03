import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      <Input type={"hidden"} name={"customerId"} value={customerId} />
      <Button
        className={cn(
          buttonVariants({
            variant: "default",
          }),
          className
        )}
      >
        {children}
      </Button>
    </form>
  );
};

export default StripePortalButton;
