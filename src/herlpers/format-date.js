export default function formatDate(date) {
	const year = date.getUTCFullYear();
	let month = date.getMonth() + 1;
	month = parseInt(month) < 10 ? `0${month}` : month;
	let day = date.getDate();
	day = parseInt(day) < 10 ? `0${day}` : day;
	let minutes = date.getUTCMinutes();
	minutes = parseInt(minutes) < 10 ? `0${minutes}` : minutes;
	let hours = date.getUTCHours();
	hours = parseInt(hours) < 10 ? `0${hours}` : hours;
	return `${day}-${month}-${year} ${hours}:${minutes}`;
}
