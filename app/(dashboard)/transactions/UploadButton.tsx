import { Upload } from "lucide-react";
import { useCSVReader } from 'react-papaparse';

import { Button } from "@/components/ui/button";

type Props = {
    onUpload: (results: any) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
    const { CSVReader } = useCSVReader();

    //TODO ADD PAYWALL
    return (
        <CSVReader onUploadAccepted={onUpload}>
            {({ getRootProps }: any) => (
                <Button 
                    size='sm'
                    className="w-3/4 lg:w-auto"
                    {...getRootProps()}
                >
                    <Upload className="size-4 mr-2"/>
                    Import
                </Button>
            )}
        </CSVReader>
    )
}