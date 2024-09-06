"use client";
import React from "react";
import Appbar from "../components/Appbar";
import DashboardPage from "../components/DashboardPage";
import Redirect from "../components/Redirect";
import useRedirect from "../hooks/useRedirect";
import { useSession } from "next-auth/react";
import StreamView from "../components/StreamView";

export default  function Dashboard() {
  const session = useSession();
  const redirect = useRedirect();

  //TODO: we will get the creatorId from atom

  try {
    if (!session.data?.user) {
      return <h1>Please Log in....</h1>;
    }

    return (
      <StreamView
      />
    );
  } catch (e) {
    return null;
  }
}
