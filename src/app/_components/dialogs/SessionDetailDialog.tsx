import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ClassTable } from "../tables/ClassTable";
import { RegistrationCards } from "../cards/RegistrationCard";
import { FeeManagementDialog } from "./FeeManagementDialog";


export const SessionDialog = ({ sessionId }: { sessionId: string }) => {
  const dialogButtons = [
    {
      text: "User Registration",
      color: "green",
      dialogContent: (
        <>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-green-800">
              Register Employee/Student
            </DialogTitle>
            <RegistrationCards />
            <p className="text-gray-600">More information about the session can go here...</p>
          </DialogHeader>
        </>
      ),
    },
    {
      text: "View Classes",
      color: "blue",
      dialogContent: (
        <>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-green-800">
              Classwise Details
            </DialogTitle>
            <ClassTable sessionId={sessionId} />
            <p className="text-gray-600">More information about the session can go here...</p>
          </DialogHeader>
        </>
      ),
    },
    {
      text: "Fee Collection",
      color: "red",
      dialogContent: (
        <>
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl font-semibold text-gray-800">
              Fee Details
            </DialogTitle>
            <p className="text-gray-600">More information about the session can go here...</p>
          </DialogHeader>
          <FeeManagementDialog />
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 bg-gray-100 rounded-md">
      {dialogButtons.map((button) => (
        <Dialog key={button.text}>
          <DialogTrigger asChild>
            <Button className={`w-full md:w-auto transition duration-300 transform hover:scale-105 bg-${button.color}-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-${button.color}-600`}>
              {button.text}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full lg:max-w-6xl rounded-md bg-white shadow-lg animate-fade-in">
            {button.dialogContent}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};
