import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

export default function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
	const { data: cookie, mutate: mutateUser } = useSWR("/api/user");

	useEffect(() => {
		// if no redirect needed, just return (example: already on /dashboard)
		// if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
		if (!redirectTo || !cookie) return;

		if (
			// If redirectTo is set, redirect if the user was not found.
			(redirectTo && !redirectIfFound && !cookie?.isLoggedIn) ||
			// If redirectIfFound is also set, redirect if the user was found
			(redirectIfFound && cookie?.isLoggedIn)
		) {
			Router.push(redirectTo);
		}
	}, [cookie, redirectIfFound, redirectTo]);

	return { cookie, mutateUser };
}
