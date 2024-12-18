import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'PETS_TYPES',
    paranoid: true,
})
export class PetType extends Model{

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