import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { DefaultRole } from 'src/common/utils/enums/role.enum';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { SubCategoryCreatedSuccessfully, SubCategoryDeletedSuccessfully, SubCategoryInfo, SubCategoryInfos } from 'src/common/utils/string.constants';

@Controller('api/v1/')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Post('sub-categories')
  async createCategory(@Req() req: any, @Body() createSubCategoryDto: CreateSubCategoryDto) {
    try {
      const result = await this.subCategoryService.createSubCategory(createSubCategoryDto, req.user.id);
      return ResponseHandler.sendResponse(SubCategoryCreatedSuccessfully, result);
    } catch (error) {
      console.error('| Create sub-category error: ', error);
      ResponseHandler.sendError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Patch('sub-categories')
  async updateCategory(@Req() req: any, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
    try {
      const result = await this.subCategoryService.updateSubCategory(updateSubCategoryDto, req.user.id);
      return ResponseHandler.sendResponse(SubCategoryCreatedSuccessfully, result);
    } catch (error) {
      console.error('| Update sub-category error: ', error);
      ResponseHandler.sendError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Get('sub-categories')
  async getAllCategories(@Req() req: any, @Query() query: any) {
    try {
      let result = await this.subCategoryService.getAllSubCategories(query)
      return ResponseHandler.sendResponse(SubCategoryInfos, result)
    } catch (error) {
      console.error("| Get All sub-category error: ", error);
      ResponseHandler.sendError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Get('sub-categories/:id')
  async getCategoryById(@Req() req: any, @Param('id') id: string) {
    try {
      let result = await this.subCategoryService.getSubCategoryById(+id)
      return ResponseHandler.sendResponse(SubCategoryInfo, result)
    } catch (error) {
      console.error("| Get sub-category error: ", error);
      ResponseHandler.sendError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(DefaultRole.SUPER_ADMIN)
  @Post('sub-categories/delete')
  async deleteSubCategory(@Req() req: any, @Body() body: { id: number }) {
    try {
      let result = await this.subCategoryService.deleteSubCategory(body.id, +req.user.id);
      return ResponseHandler.sendResponse(SubCategoryDeletedSuccessfully, result);
    } catch (error) {
      console.error('| Delete sub-category error: ', error);
      ResponseHandler.sendError(error);
    }
  }
}
