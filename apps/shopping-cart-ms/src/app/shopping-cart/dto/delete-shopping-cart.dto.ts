import { IsNotEmpty, IsUUID,} from "class-validator";

export class DeleteShoppingCartItemDto {

    @IsUUID()
    @IsNotEmpty()
    userId: string;

}
