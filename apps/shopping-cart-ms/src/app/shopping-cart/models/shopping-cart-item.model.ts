import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'SHOPPINGCARTITEM',
    paranoid: true,
})
export class ShoppingCartItem extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID',
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'USERID',
    })
    userId: string; // ID del usuario asociado al carrito

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ITEMID',
    })
    itemId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ITEMPHOTO',
    })
    itemUrl: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ITEMNAME',
    })
    itemName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'ITEMDESCRIPTION',
    })
    itemDescription: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        field: 'ITEMPRICE',
    })
    itemPrice: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'QUANTITY',
    })
    quantity: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'UUID',
    })
    cartItemUUID: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'CREATED_AT',
    })
    createdAt: Date; // Fecha en que se agregó al carrito

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'VALID_UNTIL',
        defaultValue: () => new Date(Date.now() + 7*24*60*60*1000), // 7 días
    })
    validUntil: Date; // Fecha en que se vence el carrito

    @Column({
        type:  DataType.DATE,   
        allowNull: true,
        field: 'UPDATED_AT',
    })
    updatedAt?: Date;

    @Column({
        type:  DataType.DATE, 
        allowNull: true,
        field: 'DELETED_AT',
    })
    deletedAt?: Date;

}
