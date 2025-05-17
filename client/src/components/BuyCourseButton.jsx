import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, {data, isLoading, isSuccess, isError, error }] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  useEffect(()=>{
    if (isSuccess && data?.orderId && window.Razorpay) {
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: data.courseTitle,
      image: data.courseThumbnail,
      order_id: data.orderId,
      handler: function (response) {
        toast.success("Payment successful. Redirecting...");
        setTimeout(() => {
          window.location.href = `/course-progress/${courseId}`;
        }, 1500);
      },
      prefill: {
        name: data.userName || "Student",
        email: data.userEmail || "",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }
    if(isError){
      toast.error(error?.data?.message || "Failed to create checkout session")
    }
  },[data, isSuccess, isError, error])

  return (
    <Button
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
