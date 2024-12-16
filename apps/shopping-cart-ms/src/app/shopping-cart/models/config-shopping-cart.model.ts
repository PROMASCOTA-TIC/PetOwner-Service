import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'PARAMS_CONFIGURATION',
    timestamps: false,
})
export class ShoppingCartConfiguration extends Model {
    @Column({
        type: DataType.STRING,
        primaryKey: true,
        field: 'CONFIG_KEY',
    })
    configKey: string;

    @Column({
        type: DataType.STRING,
        field: 'CONFIG_VALUE',
    })
    configValue: string;
}
