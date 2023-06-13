import { useState } from "react";

export default function useModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [error, setError] = useState(false);
	const [message, setMessage] = useState("");

	return {
		isOpen,
		setIsOpen,
		error,
		setError,
		message,
		setMessage,
	};
}
