import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { DefaultRole } from 'src/common/utils/enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { CategoryCreatedSuccessfully, CategoryDeletedSuccessfully, CategoryInfo, CategoryInfos } from 'src/common/utils/string.constants';

@Controller('api/v1/')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Post('categories')
  async createCategory(@Req() req: any, @Body() createCategoryDto: CreateCategoryDto) {
    try {
      const result = await this.categoryService.createCategory(createCategoryDto, req.user.id);
      return ResponseHandler.sendResponse(CategoryCreatedSuccessfully, result);
    } catch (error) {
      console.error('| Create category error: ', error);
      ResponseHandler.sendError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Patch('categories')
  async updateCategory(@Req() req: any, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      const result = await this.categoryService.updateCategory(updateCategoryDto, req.user.id);
      return ResponseHandler.sendResponse(CategoryCreatedSuccessfully, result);
    } catch (error) {
      console.error('| Update category error: ', error);
      ResponseHandler.sendError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Get('categories')
  async getAllCategories(@Req() req: any, @Query() query: any) {
    try {
      let result = await this.categoryService.getAllCategories(query)
      return ResponseHandler.sendResponse(CategoryInfos, result)
    } catch (error) {
      console.error("| Get All category error: ", error);
      ResponseHandler.sendError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Get('categories/:id')
  async getCategoryById(@Req() req: any, @Param('id') id: string) {
    try {
      let result = await this.categoryService.getCategoryById(+id)
      return ResponseHandler.sendResponse(CategoryInfo, result)
    } catch (error) {
      console.error("| Get category error: ", error);
      ResponseHandler.sendError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Post('categories/delete')
  async deleteCategory(@Req() req: any, @Body() body: { id: number }) {
    try {
      let result = await this.categoryService.deleteCategory(body.id, +req.user.id);
      return ResponseHandler.sendResponse(CategoryDeletedSuccessfully, result);
    } catch (error) {
      console.error('| Delete category error: ', error);
      ResponseHandler.sendError(error);
    }
  }
}
