import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'ADDRESSES',
    timestamps: true,
    paranoid: true
})
export class Address extends Model{

    @Column({
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        field: 'ID',
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ZONE',
    })
    zone: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ADDRESS_NAME',
    })
    addressName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'LAT',
    })
    lat: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'LNG',
    })
    lng: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'DESCRIPTION',
    })
    description: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'REFERENCE',
    })
    reference: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'USER_ID',
    })
    userId: string;

    @Column({
        type: DataType.DATE,  
        allowNull: false,
        field: 'CREATED_AT',
        defaultValue: () => new Date(Date.now() - 5*60*60*1000),
    })
    createdAt?: Date;

    @Column({
        type: DataType.DATE,  
        allowNull: true,
        field: 'UPDATED_AT',
    })
    updatedAt?: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,  
        field: 'DELETED_AT',
    })
    deletedAt?: Date;
}
