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
const player_entity_1 = require("./entities/player.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
let PlayerService = class PlayerService {
    constructor(playerRepository, eventEmitter) {
        this.playerRepository = playerRepository;
        this.eventEmitter = eventEmitter;
    }
    findAll() {
        return this.playerRepository.find();
    }
    findOne(id, callback) {
        this.playerRepository.findOneBy({ id }).then(player => {
            if (!player) {
                return callback(new Error(`Player with id ${id} not found`), null);
            }
            callback(null, player);
        }).catch(err => callback(err, null));
    }
    create(createPlayerDto, callback) {
        if (createPlayerDto === null || createPlayerDto === undefined) {
            return callback(new Error('User is null or undefined'), null);
        }
        if (createPlayerDto.rank === null || createPlayerDto.rank === undefined) {
            this.findAll().then(players => {
                let rank = players.reduce((acc, p) => acc + p.rank, 0) / players.length;
                rank = Math.round(rank);
                createPlayerDto.rank = rank;
                this.playerRepository.save(createPlayerDto).then(newPlayer => {
                    this.eventEmitter.emit('player.created', {
                        player: {
                            id: newPlayer.id,
                            rank: newPlayer.rank,
                        },
                    });
                    callback(null, newPlayer);
                }).catch(err => callback(err, null));
            }).catch(err => callback(err, null));
        }
        else {
            this.playerRepository.save(createPlayerDto).then(newPlayer => {
                this.eventEmitter.emit('player.created', {
                    player: {
                        id: newPlayer.id,
                        rank: newPlayer.rank,
                    },
                });
                callback(null, newPlayer);
            }).catch(err => callback(err, null));
        }
    }
    remove(id, callback) {
        this.playerRepository.delete({ id }).then(() => {
            callback(null);
        }).catch(err => callback(err));
    }
    updateRank(id, newRank, callback) {
        this.playerRepository.update(id, { rank: newRank }).then(() => {
            callback(null);
        }).catch(err => callback(err));
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