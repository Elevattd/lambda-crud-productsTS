export class Response {
	succes: Boolean;
	message: String;
	status: String;
	data: any;

	constructor() {
		this.succes = false;
		this.message = '';
		this.status = '';
		this.data = null;
	}

	defineResponse({ message, succes, status, data }: { succes: Boolean; message: String; status: String; data: any }) {
		this.succes = succes;
		this.message = message;
		this.status = status;
		this.data = data;
	}

	public returnResponse() {
		return this;
	}
}
