import { Card, CardContent } from "@/components/ui/card";

const LoadingCard = () => (
  <Card className="shadow-none">
    <CardContent>
      <div className="flex flex-col h-56">
        <div className="flex flex-row justify-between items-center">
          <div>
            <div className="mt-3 bg-gray-200 rounded-full w-[7rem] h-3 mb-2.5 "></div>
            <div className="mt-3 bg-gray-200 rounded-full w-[8rem] h-8 mb-2.5 "></div>
          </div>
          <div className="bg-gray-200 rounded-full w-[10rem] h-8 mb-2.5"></div>
        </div>
        <div className="flex flex-1" />
        <div className="mt-3 bg-gray-200 rounded-full w-full h-4 mb-2.5 "></div>
      </div>
    </CardContent>
  </Card>
);

export default LoadingCard;
