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


type ComponentProps = {
  sessionId:string
}
export const SessionDialog = ({sessionId}:ComponentProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 bg-gray-100 rounded-md">
            <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto transition duration-300 transform hover:scale-105 bg-green-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600">
            User Registration
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full lg:max-w-6xl rounded-md bg-white p-6 shadow-lg animate-fade-in">
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl font-semibold text-gray-800">
              Register Employee/ Student
            </DialogTitle>
            <RegistrationCards />
            <p className="text-gray-600">More information about the session can go here...</p>
          </DialogHeader>
        </DialogContent>
      </Dialog>


      {/* View Classes Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto transition duration-300 transform hover:scale-105 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600">
            View Classes
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full lg:max-w-6xl rounded-md bg-white p-6 shadow-lg animate-fade-in">
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl font-semibold text-gray-800">
              Classwise Details
            </DialogTitle>
            <ClassTable sessionId={sessionId}/>
            <p className="text-gray-600">More information about the session can go here...</p>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Fee Collection Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto transition duration-300 transform hover:scale-105 bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600">
            Fee Collection
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full lg:max-w-6xl rounded-md bg-white p-6 shadow-lg animate-fade-in">
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl font-semibold text-gray-800">
              Fee Details
            </DialogTitle>
            <p className="text-gray-600">More information about the session can go here...</p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
