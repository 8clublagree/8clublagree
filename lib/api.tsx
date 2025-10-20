"use client";

import { useState } from "react";
import { supabase } from "./supabase";

export const useSearchUser = () => {
  const [loading, setLoading] = useState(false);

  const searchClients = async ({ name }: { name: string }) => {
    setLoading(true);
    console.log("Searching for name: ", name);

    let query = supabase.from("user_profiles").select("*").eq("is_user", true);

    if (!!name.length) {
      query = query.ilike("full_name", `%${name}%`);
    }

    const { data, error } = await query;

    if (error) return null;

    setLoading(false);
    return data;
  };

  const searchInstructors = async ({ name }: { name: string }) => {
    setLoading(true);
    console.log("Searching for name: ", name);

    let query = supabase.from("instructors").select("*");

    if (!!name.length) {
      query = query.ilike("full_name", `%${name}%`);
    }

    const { data, error } = await query;

    if (error) return null;

    setLoading(false);
    return data;
  };

  return { searchClients, searchInstructors, loading };
};
