import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(@InjectRepository(Note) private readonly noteRepository: Repository<Note>) {}

  create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepository.create(createNoteDto);
    return this.noteRepository.save(note);
  }

  findAll(): Promise<Note[]> {
    return this.noteRepository.find({order: {id: 'DESC'}});
  }

  findOne(id: number): Promise<Note> {
    return this.noteRepository.findOne({ where: {id}})
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepository.preload({
      id: id, ...updateNoteDto,
    });
    if(!note){
      throw new NotFoundException(`Note ${id} not found`);
    }
    return this.noteRepository.save(note);
  }

  async remove(id: number) {
    const note = await this.findOne(id);
    return this.noteRepository.remove(note); 
  }
}
