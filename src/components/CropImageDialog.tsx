"use client"
import { useRef } from "react";
import {Cropper, ReactCropperElement} from "react-cropper";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import "cropperjs/dist/cropper.css";

interface CropImageDialogProps {
  src: string;
  cropAspectRadio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}


export default function CropImageDialog({src, cropAspectRadio, onCropped, onClose} : Readonly<CropImageDialogProps>){
  const cropperRef = useRef<ReactCropperElement>(null);

  function crop() {
    const cropper = cropperRef.current?.cropper;
    if(!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  }

  return <Dialog open onOpenChange={onClose}>
    <DialogHeader>
      <DialogTitle>
        Crop Image
      </DialogTitle>
    </DialogHeader>
    <Cropper
    src={src}
    aspectRatio={cropAspectRadio}
    guides={false}
    zoomable={false}
    ref={cropperRef}
    className="mx-auto size-fit"
    />
    <DialogFooter>
      <Button variant="secondary" onClick={onClose} >
        Cancel
      </Button>
      <Button onClick={crop}>Crop</Button>
    </DialogFooter>
  </Dialog>
}