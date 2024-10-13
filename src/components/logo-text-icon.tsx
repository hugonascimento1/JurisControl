import { ScaleIcon } from "lucide-react";

export default function Logo() {
    return (
        <div className="flex flex-row ml-4 mb-2">
            <h1 className="text-3xl text-white"><strong>Juris</strong>Control</h1>
            <ScaleIcon className="text-white w-10 h-10 ml-2 mr-2" />

        </div>
    );
}