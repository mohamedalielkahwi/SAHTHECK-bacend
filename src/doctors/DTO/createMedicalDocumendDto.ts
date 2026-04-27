import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Category, Title, Type } from "generated/prisma/enums";

export class CreateMedicalDocumentDto {
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    @IsEnum(Title, { message: `Title must be one of the following: ${Object.values(Title).map(String).join(', ')}` })
    title: Title;

    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    @IsEnum(Category, { message: `Category must be one of the following: ${Object.values(Category).map(String).join(', ')}` })
    category: Category;

    @IsString({ message: 'Type must be a string' })
    @IsEnum(Type, { message: `Type must be one of the following: ${Object.values(Type).map(String).join(', ')}` })
    type: Type;

    @IsString({ message: 'Description must be a string' })
    description?: string;

}