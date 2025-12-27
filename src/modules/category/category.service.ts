import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/shared/tables/postgres-tables/category.entity';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { HelperService } from 'src/common/helper/helper.service';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import slugify from 'slugify';
import { PageSize } from 'src/common/utils/constants';
import { CategoryAlreadyExist, CategoryDoesNotExist, RequireCategoryId } from 'src/common/utils/string.constants';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
    @InjectConnection()
    private sequelize: Sequelize,
    private helperService: HelperService
  ) { }

  async createCategory(categoryData: CreateCategoryDto, userId: number): Promise<Category> {
    const transaction = await this.sequelize.transaction();
    try {
      const existingCategory = await this.categoryModel.findOne({
        where: { name: categoryData.name },
        transaction,
      });
      if (existingCategory) {
        ResponseHandler.sendFound(CategoryAlreadyExist);
      }

      let category:any = this.categoryModel.build();
      category.name = categoryData.name;
      category.desc = categoryData.desc;
      category.slug = slugify(categoryData.name, {
        lower: true,
        replacement: '_',
        strict: true,
      });
      category.createdByUserId = userId;
      category.updatedByUserId = userId;

      category = await category.save({ transaction });
      await transaction.commit();

      return category;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateCategory(updateData: UpdateCategoryDto, userId: number): Promise<Category> {
    const transaction = await this.sequelize.transaction();
    try {
      let category: any = await this.categoryModel.findOne({
        where: { id: updateData.id },
        transaction,
      });
      if (!category) {
        ResponseHandler.sendNotFound(CategoryDoesNotExist);
      }

      const existingCategory = await this.categoryModel.findOne({
        where: { name: updateData.name },
        transaction,
      });

      if (existingCategory && existingCategory.id !== updateData.id) {
        ResponseHandler.sendFound(CategoryAlreadyExist);
      }

      category.name = updateData.name;
      category.desc = updateData.desc;
      category.slug = slugify(updateData?.name, {
        lower: true,
        replacement: '_',
        strict: true,
      });
      category.isActive = updateData.isActive
      category.updatedByUserId = userId;
      await category.save({ transaction });

      await transaction.commit();
      return category;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      if (!this.helperService.isNotEmpty(id)) {
        ResponseHandler.sendBadRequest(RequireCategoryId);
      }

      const category: any = await this.categoryModel.findOne({
        where: {
          id,
        }
      });

      if (!category) {
        ResponseHandler.sendNotFound(CategoryDoesNotExist);
      }

      return category;
    } catch (error) {
      throw error;
    }
  }

  async getAllCategories(params: any) {
    try {
      let pageNo: number = 1;
      let pageSize: number = PageSize;
      let offset: number = 0;
      let keywordQuery: any;
      const queryArray: any[] = [];

      if (params.isPagination == 1) {
        pageNo = params.pageNo ? parseInt(params.pageNo) : 1;
        pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        offset = (pageNo - 1) * pageSize;
      }

      if (this.helperService.isNotEmpty(params.keyword)) {
        keywordQuery = {
          [Op.or]: [{ name: { [Op.iLike]: `%${params.keyword}%` } }],
        };
        queryArray.push(keywordQuery);
      }

      if (this.helperService.isNotEmpty(params.slug)) {
        queryArray.push({ slug: params.slug });
      }

      const query = { [Op.and]: queryArray };
      const finalQuery: any = params.isPagination == 1
        ? {
          where: query,
          offset,
          limit: pageSize,
          order: [['createdAt', 'DESC']],
          distinct: true
        }
        : {
          where: query,
          distinct: true
        };

      const categories = await this.categoryModel.findAndCountAll(finalQuery);
      return { total: categories.count, categories: categories.rows };
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: number, userId: number) {
    const transaction = await this.sequelize.transaction();
    try {
      if (!this.helperService.isNotEmpty(id)) {
        ResponseHandler.sendBadRequest(RequireCategoryId);
      }

      let category: any = await this.categoryModel.findOne({
        where: {
          id
        },
        transaction
      });

      if (!category) {
        ResponseHandler.sendNotFound(CategoryDoesNotExist);
      }

      // Then delete the category
      category.updatedByUserId = userId;
      await category.destroy({ transaction });

      await transaction.commit();

      return {
        success: true,
        deletedCategory: category.name
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}