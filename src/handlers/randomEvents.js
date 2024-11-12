const { pick, randint, msToTime } = require('../utils/functions.js');

const events = [
	{
		id: 'Overtime',
		probability: 0.05,
		name: {
			'pt-BR': '**:crescent_moon: Horas extras - 3x** bônus de trabalho',
			'en-US': '**:crescent_moon: Overtime - 3x** work bonus',
			'es-ES': '**:crescent_moon: Horas extras - 3x** bonificación de trabajo',
		},
		min_time: 60,
		max_time: 120,
	},
	{
		id: 'Search Party',
		probability: 0.03,
		name: {
			'pt-BR': '**:flashlight: Busca em grupo - 2x** bônus de exploração',
			'en-US': '**:flashlight: Search party - 2x** explore bonus',
			'es-ES': '**:flashlight: Búsqueda en grupo - 2x** bonificación de exploración',
		},
		min_time: 60,
		max_time: 120,
	},
	{
		id: 'Stampede',
		probability: 0.03,
		name: {
			'pt-BR': '**:mammoth: Manada - 2x** bônus de caça',
			'en-US': '**:mammoth: Stampede - 2x** hunt bonus',
			'es-ES': '**:mammoth: Estampida - 2x** bonificación de caza',
		},
		min_time: 60,
		max_time: 120,
	},
	{
		id: 'Flood',
		probability: 0.03,
		name: {
			'pt-BR': '**:cloud_rain: Enchente - 2x** bônus de pesca',
			'en-US': '**:cloud_rain: Flood - 2x** fishing bonus',
			'es-ES': '**:cloud_rain: Inundación - 2x** bonificación de pesca',
		},
		min_time: 60,
		max_time: 120,
	},
	{
		id: 'Comet',
		probability: 0.03,
		name: {
			'pt-BR': '**:comet: Cometa - 2x** bônus de mineração',
			'en-US': '**:comet: Comet - 2x** mining bonus',
			'es-ES': '**:comet: Cometa - 2x** bonificación de minería',
		},
		min_time: 60,
		max_time: 120,
	},
];

class randomEvents {
	_events = new Map(events.map((a) => [a.id, a]));
	_chances = Array.from(events.map((a) => [a.id, a.probability]));
	activeEvents = new Map();

	constructor() {
		var threshold = 1;
		setInterval(
			() => {
				const luck = randint(0, 100);
				if (luck <= threshold) {
					threshold = 1;
					this.startEvent();
				} else {
					threshold += 1;
				}
			},
			1000 * 60 * 45
		);
	}

	all() {
		return this._events;
	}

	getById(id) {
		return this._events.get(id) ?? null;
	}

	isActive(id) {
		return this.activeEvents.get(id) ?? false;
	}

	async startEvent() {
		const id = pick(this._chances);
		const event = this.getById(id);
		if (!this.isActive(id)) {
			var duration = 1000 * 60 * randint(event.min_time, event.max_time);
			this.activeEvents.set(id, Date.now() + duration);
			setTimeout(() => {
				this.activeEvents.delete(id);
			}, duration);
		}
	}

	stringifyActives(interaction) {
		var events = '';
		for (const [id, value] of this.activeEvents.entries()) {
			events += `\n${this.getById(id).name[interaction.locale]} 
				(${msToTime(value - Date.now())})`;
		}
		return events;
	}
}

module.exports = new randomEvents();
