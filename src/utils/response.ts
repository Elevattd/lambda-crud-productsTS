export enum RESPONSE_STATUS {
	//succes codes
	OK = '200',
	CREATED = '201',
	ACCEPTED = '202',
	UPDATED = '202',
	DELETED = '201',
	NO_CONTENT = '204',
	PARTIAL_CONTENT = '206',

	//error codes
	SERVER_ERROR = '500',
	NOT_FOUND = '404',
	BAD_REQUEST = '400',
	UNAUTHORIZED = '401',
	FORBIDDEN = '403',
	CONFLICT = '409',
}

export const RESPONSE_SUCCES = {
	//succes
	OK: true,
	CREATED: true,
	UPDATED: true,
	DELETED: true,
	ACCEPTED: true,
	NO_CONTENT: true,
	PARTIAL_CONTENT: true,

	//error
	SERVER_ERROR: false,
	NOT_FOUND: false,
	BAD_REQUEST: false,
	UNAUTHORIZED: false,
	FORBIDDEN: false,
	CONFLICT: false,
};

export enum RESPONSE_MESSAGES {
	OK = 'OK',
	CREATED = 'Product id: <@param@>, created successfully.',
	UPDATED = 'Product id: <@param@>, updated successfully.',
	DELETED = 'Product id: <@param@>, deleted successfully.',
	ACCEPTED = '',
	NO_CONTENT = 'Product id: <@param@>, not exits.',
	PARTIAL_CONTENT = '',

	//error
	SERVER_ERROR = '',
	NOT_FOUND = '',
	BAD_REQUEST = '',
	UNAUTHORIZED = '',
	FORBIDDEN = '',
	CONFLICT = '',

	ERROR_CREATED = 'Error creating the product.',
	ERROR_UPDATED = 'Error updated the product.',
	ERROR_DELETED = 'Error delete the product.',
}

export const GET_RESPONSE_MESSAGE = (message: RESPONSE_MESSAGES, param?: string) => {
	return param ? message.replace(`<@param@>`, param) : message;
};
