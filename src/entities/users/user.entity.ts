import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true, type: 'varchar' })
    email!: string;

    @Column({ unique: true, type: 'varchar' })
    username!: string;

    @Column({ type: 'varchar' })
    password!: string;

    @Column({ type: 'varchar' })
    salt!: string;

    @Column({ type: 'timestamp' })
    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type: 'timestamp' })
    @UpdateDateColumn()
    updatedAt?: Date;

    @Column({ type: 'timestamp' })
    @DeleteDateColumn()
    deletedAt?: Date;

}
