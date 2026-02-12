"use client";

import { useState } from "react";
import { supabase, UpdateUserProfile } from "./supabase";
import {
  CreateClassProps,
  CreateInstructorProps,
  CreatePackageProps,
  CreateUserCredits,
} from "./props";
import dayjs, { Dayjs } from "dayjs";
import { getDateFromToday } from "./utils";
import { useAppSelector } from "./hooks";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axiosApi from "./axiosConfig";
import axios from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);

// Client GET cache (TTL) — fewer duplicate API calls, lower server/DB load
// const CACHE_TTL_MS = { about: 60_000, packages: 30_000, classes: 15_000 };
// const getCache = new Map<string, { data: unknown; expires: number }>();
// function getCached<T>(key: string, ttlMs: number): T | null {
//   const entry = getCache.get(key);
//   if (!entry || Date.now() >= entry.expires) return null;
//   return entry.data as T;
// }
// function setCached(key: string, data: unknown, ttlMs: number): void {
//   getCache.set(key, { data, expires: Date.now() + ttlMs });
// }
// Invalidate cache by prefix after mutations so UI doesn't show stale data
// function invalidateGetCache(prefix: string): void {
//   Array.from(getCache.keys()).forEach((key) => {
//     if (key.startsWith(prefix)) getCache.delete(key);
//   });
// }

export const useAboutPageData = () => {
  const [loading, setLoading] = useState(false);

  const fetchPageData = async () => {
    // const cacheKey = "about";
    // const cached = getCached<{ classesRes: unknown; trainersRes: unknown; schedulesRes: unknown } | null>(cacheKey, CACHE_TTL_MS.about);
    // if (cached) return cached;
    try {
      setLoading(true);
      const response = await axiosApi.get(`/about`, { params: { type: "about" } });
      const { classesRes, trainersRes, schedulesRes } = response.data.data;
      if (classesRes.error || trainersRes.error || schedulesRes.error) return null;
      const result = { classesRes, trainersRes, schedulesRes };
      // setCached(cacheKey, result, CACHE_TTL_MS.about);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchPageData, loading };
};

export const useAdminProfile = () => {
  const [loading, setLoading] = useState(false);

  const getAdmin = async ({ id }: { id: string }) => {
    try {
      setLoading(true);
      const response = await axiosApi.get(`/admin/getAdmin`, { params: { id } });
      const profile = response?.data?.data;
      if (!profile) return null;
      return profile;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getAdmin, loading };
};

export const useSearchUser = () => {
  const [loading, setLoading] = useState(false);

  const validateEmail = async ({ email }: { email: string }) => {
    try {
      setLoading(true);
      const response = await axiosApi.get(`/user/validate-email`, { params: { email } });
      return response?.data?.data ?? null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchClients = async ({ name }: { name?: string }) => {
    try {
      setLoading(true);
      const response = await axiosApi.get(`/user/search-clients`, { params: { name } });
      return response?.data?.data ?? null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async ({
    name,
    email,
    contact_number,
    page = 1,
    pageSize = 10,
  }: {
    name?: string;
    email?: string;
    contact_number?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: any[]; total: number } | null> => {
    try {
      setLoading(true);
      const response = await axiosApi.get(`/user/fetch-clients`, {
        params: { name, email, contact_number, page, pageSize },
      });
      const data = response?.data?.data ?? null;
      const total = response?.data?.total ?? 0;
      if (data === null) return null;
      return { data, total };
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchInstructors = async ({ name }: { name?: string }) => {
    try {
      setLoading(true);
      const response = await axiosApi.get(`/user/search-instructors`, { params: { name } });
      return response?.data?.data ?? null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { validateEmail, fetchClients, searchClients, searchInstructors, loading };
};

export const useManagePassword = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const validatePassword = async ({
    email,
    currentPassword,
  }: {
    email: string;
    currentPassword: string;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.get(`/user/validate-password`, {
        params: { email, password: currentPassword },
      });
      return response?.data?.data ?? null;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async ({
    userID,
    newPassword,
  }: {
    userID: string;
    newPassword: string;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post(`/user/change-password`, {
        id: userID,
        password: newPassword,
      });
      return response?.data?.data ?? null;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };



  return { validatePassword, changePassword, loading };
};

export const useForgotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const requestPasswordReset = async ({ email }: { email: string }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post("/request-password-reset", {
        email,
        type: "reset-link"
      });
      return { data: response?.data, error: null };
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Failed to send OTP";
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async ({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post("/verify-otp", { email, otp });
      const data = response?.data;
      return { data, error: null };
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Invalid or expired OTP";
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { requestPasswordReset, verifyOtp, loading };
};

export const useResetPasswordWithToken = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const validateResetToken = async (token: string) => {
    try {
      const response = await axiosApi.get("/validate-reset-token", {
        params: { token },
      });
      return { data: response?.data, error: null };
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Invalid or expired link";
      return { data: null, error: message };
    }
  };

  const resetPasswordWithToken = async ({
    token,
    new_password,
  }: {
    token: string;
    new_password: string;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post("/reset-password-with-token", {
        token,
        new_password,
      });
      return { data: response?.data, error: null };
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Failed to update password";
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { validateResetToken, resetPasswordWithToken, loading };
};

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);

  const updateUser = async ({
    id,
    values,
  }: {
    id: string;
    values: UpdateUserProfile;
  }) => {
    setLoading(true);

    const response = await axiosApi.post(`/user/update-profile`, {
      id,
      values,
    });

    const data = response?.data?.data;

    if (!data) return null;

    setLoading(false);
    return data;
  };

  return { loading, updateUser };
};

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);

  const deleteUser = async ({ id }: { id: string }) => {
    setLoading(true);

    const response = await axiosApi.post("/user/delete", {
      id: id,
    });

    const responseData = response?.data?.data;

    if (!responseData) return null;

    setLoading(false);
    return responseData;
  };

  return { loading, deleteUser };
};

export const useManageImage = () => {
  const [loading, setLoading] = useState(false);
  const removeImage = async ({ id }: { id: string }) => {
    setLoading(true);
    const { data: existingURL } = await supabase
      .from("instructors")
      .select("avatar_path")
      .eq("id", id)
      .single();

    if (existingURL) {
      await supabase.storage
        .from("user-photos")
        .remove([existingURL?.avatar_path]);
    }

    setLoading(false);
    return;
  };

  const fetchImage = async ({
    avatarPath,
    bucket = "user-photos",
  }: {
    avatarPath: string;
    bucket?: string;
  }) => {
    let signedUrl: any;

    if (avatarPath === null || avatarPath === undefined || !avatarPath.length) return null;


    const { data, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(`${avatarPath}`, 3600);

    if (urlError) {
      console.error("Error generating signed URL:", urlError);
      signedUrl = null;
    }

    signedUrl = data?.signedUrl;

    return signedUrl;
  };

  const saveImage = async ({ file, id }: { file: any; id?: string }) => {
    let filePath: string = "";

    if (id) {
      filePath = `${id}_${dayjs().toDate().getTime()}`;
    } else {
      filePath = `${dayjs().toDate().getTime()}`;
    }
    const fileExt = (file[0] as File).name.split(".").pop();
    const fileName = `${filePath}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("user-photos")
      .upload(fileName, file[0].originFileObj as File, {
        upsert: true, // overwrite if exists
        contentType: (file[0] as File).type,
      });

    if (uploadError) throw uploadError;

    const imageURL = fileName;

    return imageURL;
  };

  return { saveImage, fetchImage, removeImage, loading };
};

export const useInstructorManagement = () => {
  const [loading, setLoading] = useState(false);

  const createInstructorProfile = async ({
    values,
  }: {
    values: CreateInstructorProps;
  }) => {
    setLoading(true);

    const response = await axiosApi.post(
      "/instructor/create-instructor-profile",
      { values },
    );

    const data = response?.data?.data;

    if (!data) return null;

    setLoading(false);
    return data;
  };

  const updateInstructor = async ({
    id,
    values,
  }: {
    id: string;
    values: CreateInstructorProps;
  }) => {
    setLoading(true);

    const response = await axiosApi.put("/instructor/update-instructor", {
      id,
      values,
    });

    const data = response?.data?.data;

    if (!data) return null;

    setLoading(false);
    return data;
  };

  const deleteInstructor = async ({ id }: { id: string }) => {
    try {
      setLoading(true);

      const response = await axiosApi.post("/user/delete", { id });
      const data = response?.data?.data;

      if (!data) return null;

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  const deactivateInstructor = async ({ id }: { id: string }) => {
    try {
      setLoading(true);

      const response = await axiosApi.put("/instructor/deactivate", { id });
      const data = response?.data?.data;

      if (!data) return null;

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  const reactivateInstructor = async ({ id }: { id: string }) => {
    try {
      setLoading(true);

      const response = await axiosApi.put("/instructor/reactivate", { id });
      const data = response?.data?.data;

      if (!data) return null;

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  return {
    loading,
    reactivateInstructor,
    deactivateInstructor,
    createInstructorProfile,
    updateInstructor,
    deleteInstructor,
  };
};

export const useClassManagement = () => {
  const [loading, setLoading] = useState(false);
  const { updateUserCredits } = useManageCredits();
  const user = useAppSelector((state) => state.auth.user);

  const markAttendance = async ({
    bookingID,
    status,
  }: {
    bookingID: string;
    status: string;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.put("/classes/mark-attendance", { bookingID, status });
      const data = response?.data?.data;
      if (!data) return null;
      // invalidateGetCache("classes:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rebookAttendee = async ({
    oldClassID,
    newClassID,
    bookingID,
    oldTakenSlots,
    newTakenSlots,
  }: {
    oldTakenSlots: number;
    newTakenSlots: number;
    oldClassID: string;
    bookingID: string;
    newClassID: string;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.put("/classes/rebook-attendee", {
        oldClassID, newClassID, bookingID, oldTakenSlots, newTakenSlots,
      });
      const data = response?.data?.data;
      if (!data) return null;
      // invalidateGetCache("classes:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchClassAttendees = async ({ classID }: { classID: string }) => {
    try {
      setLoading(true);
      const response = await axiosApi.get(`/classes/fetch-attendees`, { params: { classID } });
      const data = response?.data?.data;
      if (!data) return null;
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async ({
    isAdmin = false,
    isInstructor = false,
    userId,
    startDate,
    endDate,
    selectedDate,
    instructorId,
  }: {
    isAdmin?: boolean;
    isInstructor?: boolean;
    userId?: string;
    instructorId?: string;
    startDate?: Dayjs;
    endDate?: Dayjs;
    selectedDate?: Dayjs;
  }) => {

    try {
      setLoading(true);
      const response = await axiosApi.get("/classes/fetch-classes", {
        params: { isAdmin, isInstructor, userId, startDate, endDate, selectedDate, instructorId },
      });
      const data = response?.data?.data;
      if (!data) return null;
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createClass = async ({ values }: { values: CreateClassProps }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post("/classes/create-class", { values });
      const data = response?.data?.data;
      if (!data) return null;
      // invalidateGetCache("classes:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async ({
    id,
    values,
  }: {
    id: string;
    values?: CreateClassProps;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.put("/classes/update-class", { id, values });
      const data = response?.data?.data;
      if (!data) return null;
      // invalidateGetCache("classes:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelClass = async ({
    id,
    classID,
    takenSlots,
  }: {
    id: string;
    classID: string;
    takenSlots: number;
  }) => {
    try {
      setLoading(true);

      const response = await axiosApi.put("/classes/cancel-class", {
        id,
        classID,
        takenSlots,
        userID: user?.id as string,
        userCredits: user?.credits,
      });

      const data = response.data.data;
      if (data === null) return null;
      // invalidateGetCache("classes:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async ({ id }: { id: string }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post("/classes/delete-class", { id });
      const data = response.data?.data;
      if (data === null) return null;
      // invalidateGetCache("classes:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const bookClass = async ({
    classDate,
    bookerId,
    classId,
    isWalkIn,
    walkInFirstName,
    walkInLastName,
    walkInClientEmail,
    walkInClientContactNumber,
  }: {
    classDate: string;
    classId: string;
    isWalkIn: boolean;
    bookerId?: string;
    walkInFirstName?: string;
    walkInLastName?: string;
    walkInClientEmail?: string;
    walkInClientContactNumber?: string;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post("/classes/book-class", {
        classDate, bookerId, classId, isWalkIn,
        walkInFirstName, walkInLastName, walkInClientEmail, walkInClientContactNumber,
      });
      const data = response.data?.data;
      if (data === null) return null;
      // invalidateGetCache("classes:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteClass,
    loading,
    bookClass,
    cancelClass,
    markAttendance,
    rebookAttendee,
    fetchClassAttendees,
    updateClass,
    fetchClasses,
    createClass,
  };
};

export const usePackageManagement = () => {
  const [loading, setLoading] = useState(false);

  const createPackage = async ({ values }: { values: any }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post("/package/create-package", { values });
      const data = response.data?.data;
      if (!data) return null;
      // invalidateGetCache("packages:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async ({
    isAdmin,
  }: {
    isAdmin: boolean | undefined;
  }) => {
    // const cacheKey = `packages:${String(isAdmin)}`;
    // const cached = getCached<unknown>(cacheKey, CACHE_TTL_MS.packages);
    // if (cached) return cached;
    try {
      setLoading(true);
      const response = await axiosApi.get("/package/fetch-packages", { params: { isAdmin } });
      const data = response.data?.data;
      if (!data) return null;
      // setCached(cacheKey, data, CACHE_TTL_MS.packages);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePackage = async ({
    id,
    values,
  }: {
    id: string;
    values: CreatePackageProps;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.put("/package/update-package", { id, values });
      const data = response.data?.data;
      if (!data) return null;
      // invalidateGetCache("packages:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async ({ id }: { id: string }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post("/package/delete-package", { id });
      const data = response.data?.data;
      if (!data) return null;
      // invalidateGetCache("packages:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const purchasePackage = async ({
    userID,
    packageID,
    paymentMethod,
    validityPeriod,
    packageCredits,
    packageName,
  }: {
    userID: string;
    packageID: string;
    paymentMethod: string;
    packageName: string;
    packageCredits: number;
    validityPeriod: number;
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.post("/package/purchase-package", {
        userID, packageID, paymentMethod, validityPeriod, packageCredits, packageName,
      });
      const data = response.data?.data;
      if (!data) return null;
      // invalidateGetCache("packages:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateClientPackage = async ({
    clientPackageID,
    values,
  }: {
    clientPackageID: string;
    values?: {
      status?: string;
      packageCredits?: number;
      validityPeriod?: number;
      expirationDate?: Dayjs;
    };
  }) => {
    try {
      setLoading(true);
      const response = await axiosApi.put("/package/update-client-package", { clientPackageID, values });
      const data = response.data?.data;
      if (!data) return null;
      // invalidateGetCache("packages:");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchClientPackages = async ({
    clientID,
    findExpiry,
  }: {
    clientID?: string;
    findExpiry?: boolean | undefined;
  }) => {
    // const cacheKey = `packages:client:${clientID ?? "all"}:${String(findExpiry ?? false)}`;
    // const cached = getCached<unknown>(cacheKey, CACHE_TTL_MS.packages);
    // if (cached) return cached;

    // setLoading(true);

    const response = await axiosApi.get("/package/fetch-client-packages", {
      params: { clientID, findExpiry },
    });

    const data = response.data?.data;

    if (!data) {
      setLoading(false);
      return null;
    }

    // setCached(cacheKey, data, CACHE_TTL_MS.packages);
    setLoading(false);
    return data;
  };

  return {
    loading,
    deletePackage,
    updateClientPackage,
    fetchClientPackages,
    purchasePackage,
    updatePackage,
    createPackage,
    fetchPackages,
  };
};

export const useClientBookings = () => {
  const [loading, setLoading] = useState(false);

  const fetchClientBookings = async ({ userID }: { userID: string }) => {
    try {
      setLoading(true);

      const response = await axiosApi.get("/user/fetch-client-bookings", {
        params: { userID },
      });

      const data = response.data?.data;

      if (!data) return null;

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  return { loading, fetchClientBookings };
};

export const useManageCredits = () => {
  const [loading, setLoading] = useState(false);

  const createUserCredits = async ({
    values,
  }: {
    values: CreateUserCredits;
  }) => {
    try {
      setLoading(true);

      const response = await axiosApi.post("/credits/create-user-credits", {
        values,
      });

      const data = response.data?.data;

      if (!data) return null;

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  const updateUserCredits = async ({
    userID,
    values,
  }: {
    userID: string;
    values?: { credits: number };
  }) => {
    try {
      setLoading(true);

      const response = await axiosApi.put("/credits/update-user-credits", {
        userID,
        values,
      });

      const data = response.data?.data;

      if (!data) return null;

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  return { loading, updateUserCredits, createUserCredits };
};

export const useManageOrders = () => {
  const [loading, setLoading] = useState(false);

  const handleViewPayment = async ({ id }: { id: string }) => {
    try {
      setLoading(true);
      const response = await axiosApi.get("/admin/payments/fetch-payment", { params: { id } });
      setLoading(false);
      return response?.data?.data ?? null;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  const updatePaymentStatus = async ({
    id,
    approved_at,
    status,
  }: {
    id: string;
    status: string;
    approved_at: string;
  }) => {
    try {
      setLoading(true);

      const response = await axiosApi.put("/admin/payments/update", {
        id,
        values: { status, approved_at },
      });

      if (!response.data) return null;

      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  const fetchCustomerPayments = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);

      const response = await axiosApi.get("/admin/payments/fetch", {
        params: { page, pageSize },
      });

      if (response && !response.data) return null;

      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    setLoading(false);
  };

  return { loading, handleViewPayment, fetchCustomerPayments, updatePaymentStatus };
};
