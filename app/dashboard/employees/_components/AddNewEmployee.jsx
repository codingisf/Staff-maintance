"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import GlobalApi from "@/app/_services/GlobalApi";
import { LoaderIcon } from "lucide-react";
import * as faceapi from "face-api.js";

function AddNewStudent({ refreshData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [faceVector, setFaceVector] = useState(null);
  const videoRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load models and start camera when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadModelsAndStartCamera();
    }
  }, [isOpen]);

  const stopCamera = () => {
  const video = document.querySelector("video");
  const stream = video?.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
  }
};


  const loadModelsAndStartCamera = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error loading models or accessing camera:", err);
      toast.error("Failed to load models or access camera.");
    }
  };

  const handleCaptureFace = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      toast.error("No face detected. Please try again.");
      return;
    }

    const descriptor = detection.descriptor;
    setFaceVector(descriptor);
    console.log("Captured Face Vector:", descriptor);
    toast.success("Face captured successfully!");
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    if (!faceVector) {
      toast.error("Please capture the face before submitting.");
      setIsLoading(false);
      return;
    }

    const payload = {
      ...data,
      faceVector: Array.from(faceVector), // Convert Float32Array to regular array
    };

    GlobalApi.CreateNewEmployee(payload).then((res) => {
      if (res.data) {
        reset();
        refreshData();
        stopCamera();
        setIsOpen(false);
        toast.success("New Employee Added successfully");
      }
      setIsLoading(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>+ Add New Employee</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription asChild>
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label>Full Name</label>
                  <Input placeholder="Ex: John" {...register("name", { required: true })} />
                </div>
                <div>
                  <label>Role</label>
                  <Input placeholder="Ex: Welder" {...register("role", { required: true })} />
                </div>
                <div>
                  <label>Salary</label>
                  <Input
                    type="number"
                    placeholder="Ex: 30000"
                    {...register("salary", { required: true })}
                  />
                </div>
                <div>
                  <label>Camera Preview</label>
                
                  <video ref={videoRef} autoPlay muted className="w-full border rounded-md" />
                </div>
                <div>
                  <Button type="button" onClick={handleCaptureFace} >
                    Capture Face
                  </Button>
                </div>
                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    onClick={() => {setIsOpen(false) ; stopCamera();}}
                    variant="ghost"
                    className="border border-primary"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isLoading ? <LoaderIcon className="animate-spin" /> : "Confirm"}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewStudent;