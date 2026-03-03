import dayjs from "dayjs";

export function getDate(data?: dayjs.Dayjs | Date | string | number | null): string {
	if (data) {
		return dayjs(data).locale('hi').format('DD MMMM YYYY');
	}
	const today = dayjs(new Date()).locale('hi').format('DD MMMM YYYY');
	
	return today;
}

export const formatDate = (date: dayjs.Dayjs | null) => {
	return date ? dayjs(date).format('YYYY-MM-DD') : '';
};

export function getDay(data?: dayjs.Dayjs | Date | string | number | null): string {
	if (data) {
		return dayjs(data).format('dddd');
	}
	const today = dayjs(new Date()).format('dddd');
	
	return today;
}

export function getTime(data: dayjs.Dayjs | null): string {
  if (!data) return '';
  return data.subtract(1, 'hour').format('HH:mm');
}

export function getCurrentTime(): string {
	const currentDate = new Date();

	let hours = currentDate.getHours();
	let minutes = currentDate.getMinutes();

	minutes = minutes < 10 ? 0 + minutes : minutes;
	const time = `${hours}:${minutes}`;

	return time;
}


export const convertTo12HourFormat = (time24: string): { time: string; period: string } => {
	if(!time24){
		return {time: '', period: ''}
	}
	const [hours, minutes] = time24.split(':').map(Number);
	const period = hours >= 12 ? 'PM' : 'AM';
	const hours12 = hours % 12 || 12;
	return { time: `${hours12}:${minutes.toString().padStart(2, '0')}`, period };
};