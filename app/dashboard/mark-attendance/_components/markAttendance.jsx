"use client";
import React, { useEffect, useState, useRef } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import moment from "moment";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "sonner";
import * as faceapi from "face-api.js";

ModuleRegistry.registerModules([AllCommunityModule]);

function MarkAttendence({ AttendanceList, selectedMonth }) {
  const videoRef = useRef(null);
  const [countdown, setCountdown] = useState(5);
  const [showOverlay, setShowOverlay] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [captureTime, setCaptureTime] = useState("");

  useEffect(() => {
    const loadModelsAndStartCamera = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error loading models or accessing camera:", err);
        toast.error("Failed to load models or access camera.");
      }
    };

    loadModelsAndStartCamera();

    return () => {
      const video = videoRef.current;
      const stream = video?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!showOverlay) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setShowOverlay(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showOverlay]);

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

    const descriptor = Array.from(detection.descriptor);
    try {
      const res = await fetch("/api/match-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ descriptor }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Welcome ${data.employee.name}!`);

        const date = moment(selectedMonth).format("MM/YYYY");
        const day = moment().date();
        const time = moment().format("hh:mm:ss A");
        setCaptureTime(time); // ✅ update state for UI

        

        const payload = {
          day,
          EmployeeId: data.employee.id,
          present: true,
          date,
          time
        };

        setMatchedUser(data.employee);
        setCountdown(5);
        setShowOverlay(true);

        await GlobalApi.MarkAttendence(payload);
      } else {
        toast.error("Face not recognized. Try again.");
      }
    } catch (error) {
      console.error("Error matching face:", error);
      toast.error("Server error. Try again later.");
    }
  };

  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const daynumberOfDays = daysInMonth(
    moment(selectedMonth).format("YYYY"),
    moment(selectedMonth).format("MM")
  );
  const daysArray = Array.from({ length: daynumberOfDays }, (_, i) => i + 1);

  useEffect(() => {
    if (Array.isArray(AttendanceList)) {
      const userList = getUniqueRecord(AttendanceList);
      daysArray.forEach((date) => {
        userList.forEach((obj) => {
          obj[date] = isPresent(obj.EmployeeId, date);
        });
      });
    }
  }, [AttendanceList]);

  const isPresent = (EmployeeId, day) => {
    return AttendanceList.find(
      (item) => item.day == day && item.EmployeeId == EmployeeId
    )
      ? true
      : false;
  };

  const getUniqueRecord = (list) => {
    const uniqueRecord = [];
    const existingUsers = new Set();

    list.forEach((record) => {
      if (!existingUsers.has(record.EmployeeId)) {
        existingUsers.add(record.EmployeeId);
        uniqueRecord.push(record);
      }
    });

    return uniqueRecord;
  };

  const onMarkAttendance = (day, EmployeeId, presentStatus) => {
    const date = moment(selectedMonth).format("MM/YYYY");
    if (presentStatus) {
      setCaptureTime(moment().format("hh:mm A")); // set the capture time
      const data = {
        day,
        EmployeeId,
        present: presentStatus,
        date,
        time
      };

      GlobalApi.MarkAttendence(data).then(() => {
        toast.success(`Employee ID ${EmployeeId} marked as Present`);
        setShowOverlay(true);
      });
    } else {
      GlobalApi.MarkAbsent(EmployeeId, day, date).then(() => {
        toast.warning(`Employee ID ${EmployeeId} marked as Absent`);
      });
    }
  };

  return (
    <div>
      {/* Overlay for face match success */}
      {showOverlay && matchedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center flex-col text-white">
          <div className="bg-green-600 px-8 py-4 rounded-xl shadow-xl text-center animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">✅ Face Match Successful!</h1>
            <p className="text-lg">Welcome, {matchedUser.name}.</p>
            <p className="text-sm mt-1">Captured at: {captureTime}</p>
            <p className="text-sm mt-2">Continuing in {countdown} seconds...</p>
          </div>
        </div>
      )}

      <label>Camera Preview</label>
      <video
        ref={videoRef}
        autoPlay
        muted
        className=" h-[80vh] border rounded-md mx-auto"
      />
      <div className="text-center mt-2">
        <button
          onClick={handleCaptureFace}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
        >
          Mark Attendance
        </button>
      </div>
    </div>
  );
}

export default MarkAttendence;
