"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("../entities/player.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
let PlayerService = class PlayerService {
    constructor(playerRepository, eventEmitter) {
        this.playerRepository = playerRepository;
        this.eventEmitter = eventEmitter;
    }
    findAll() {
        return this.playerRepository.find();
    }
    async findOne(id) {
        const player = await this.playerRepository.findOneBy({ id });
        if (!player) {
            throw new Error(`Player with id ${id} not found`);
        }
        return player;
    }
    async create(createPlayerDto) {
        const player = new player_entity_1.Player();
        player.id = createPlayerDto.id;
        player.rank = createPlayerDto.rank || 1000;
        const newPlayer = await this.playerRepository.save(player);
        this.eventEmitter.emit('player.created', {
            player: {
                id: newPlayer.id,
                rank: newPlayer.rank
            }
        });
        return newPlayer;
    }
    async remove(id) {
        await this.playerRepository.delete(id);
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], PlayerService);
//# sourceMappingURL=player.service.js.map