import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'PETS',
    paranoid: true,
})
export class Pet extends Model{

    @Column({
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        unique: true,
        field: 'ID',
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'NAME',
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'PET_TYPE_ID',
    })
    petTypeId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'BREED_ID',
    })
    breedId: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'BIRTHDAY',
    })
    birthday: Date;

    @Column({
        type: DataType.CHAR(1),
        allowNull: false,
        field: 'GENDER',
    })
    gender: string;

    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull: false,
        field: 'WEIGHT',
    })
    weight: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'PREFERENCES ',
    })
    preferences: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        field: 'MEDICAL_HISTORY',
    })
    medicalHistory: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        field: 'PHOTOS',
    })
    photosUrls: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'OWNER_ID',
    })
    ownerId: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'CREATED_AT',
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'UPDATED_AT',
    })
    updatedAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'DELETED_AT',
    })
    deletedAt: Date;
}
