export const getArgentinaDate = (date: string) => {
	const newDate = new Date(date);
	newDate.setHours(newDate.getHours() - 3);
	return `${newDate.toISOString()}`;
};
3;

export const capitalizar = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export enum productState {
	BORRADOR = 'BORRADOR',
	PUBLICAR = 'PUBLICAR',
}
