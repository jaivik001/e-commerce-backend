import { Injectable } from '@nestjs/common';
import { ResponseHandler } from 'src/common/dtoes/response.dto';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { HelperService } from 'src/common/helper/helper.service';
import { CategoryDoesNotExist, RequireSubCategoryId, SubCategoryAlreadyExist, SubCategoryDoesNotExist } from 'src/common/utils/string.constants';
import slugify from 'slugify';
import { PageSize } from 'src/common/utils/constants';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { SubCategory } from 'src/shared/tables/postgres-tables/sub-category.entity';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Category } from 'src/shared/tables/postgres-tables/category.entity';
import { Status } from 'src/common/utils/enums/status.enum';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory)
    private subCategoryModel: typeof SubCategory,
    @InjectModel(Category)
    private categoryModel: typeof Category,
    @InjectConnection()
    private sequelize: Sequelize,
    private helperService: HelperService
  ) { }

  async createSubCategory(subCategoryData: CreateSubCategoryDto, userId: number): Promise<SubCategory> {
    const transaction = await this.sequelize.transaction();
    try {

      let category = await this.categoryModel.findOne({
        where: { id: subCategoryData.categoryId, isActive: Status.YES },
        transaction,
      });
      if (!category) {
        ResponseHandler.sendNotFound(CategoryDoesNotExist);
      }

      const existingSubCategory = await this.subCategoryModel.findOne({
        where: { name: subCategoryData.name },
        transaction,
      });
      if (existingSubCategory) {
        ResponseHandler.sendFound(SubCategoryAlreadyExist);
      }

      let subCategory:any = this.subCategoryModel.build();
      subCategory.name = subCategoryData.name;
      subCategory.categoryId = subCategoryData.categoryId;
      subCategory.desc = subCategoryData.desc;
      subCategory.slug = slugify(subCategoryData.name, {
        lower: true,
        replacement: '_',
        strict: true,
      });
      subCategory.createdByUserId = userId;
      subCategory.updatedByUserId = userId;

      subCategory = await subCategory.save({ transaction });
      await transaction.commit();

      return subCategory;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateSubCategory(updateData: UpdateSubCategoryDto, userId: number): Promise<SubCategory> {
    const transaction = await this.sequelize.transaction();
    try {

      let category = await this.categoryModel.findOne({
        where: { id: updateData.categoryId, isActive: Status.YES },
        transaction,
      });
      if (!category) {
        ResponseHandler.sendNotFound(CategoryDoesNotExist);
      }

      let subCategory: any = await this.subCategoryModel.findOne({
        where: { id: updateData.id },
        transaction,
      });
      if (!subCategory) {
        ResponseHandler.sendNotFound(SubCategoryDoesNotExist);
      }

      const existingSubCategory = await this.subCategoryModel.findOne({
        where: { name: updateData.name },
        transaction,
      });

      if (existingSubCategory && existingSubCategory.id !== updateData.id) {
        ResponseHandler.sendFound(SubCategoryAlreadyExist);
      }

      subCategory.name = updateData.name;
      subCategory.desc = updateData.desc;
      subCategory.categoryId = updateData.categoryId;
      subCategory.isActive = subCategory.isActive;
      subCategory.slug = slugify(updateData?.name, {
        lower: true,
        replacement: '_',
        strict: true,
      });
      subCategory.updatedByUserId = userId;
      await subCategory.save({ transaction });

      await transaction.commit();
      return subCategory;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getSubCategoryById(id: number): Promise<SubCategory> {
    try {
      if (!this.helperService.isNotEmpty(id)) {
        ResponseHandler.sendBadRequest(RequireSubCategoryId);
      }

      const subCategory: any = await this.subCategoryModel.findOne({
        where: {
          id,
        },
        include: [{
          model: Category,
          attributes: ['id', 'name', 'slug']
        }]
      });

      if (!subCategory) {
        ResponseHandler.sendNotFound(SubCategoryDoesNotExist);
      }

      return subCategory;
    } catch (error) {
      throw error;
    }
  }

  async getAllSubCategories(params: any) {
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

      if (this.helperService.isNotEmpty(params.categoryId)) {
        queryArray.push({ slug: params.categoryId });
      }

      const query = { [Op.and]: queryArray };
      const finalQuery: any = params.isPagination == 1
        ? {
          where: query,
          include: [{
            model: Category,
            attributes: ['id', 'name', 'slug']
          }],
          offset,
          limit: pageSize,
          order: [['createdAt', 'DESC']],
          distinct: true
        }
        : {
          where: query,
          include:[{
            model: Category,
            attributes: ['id', 'name', 'slug']
          }],
          distinct: true
        };

      const subCategories = await this.subCategoryModel.findAndCountAll(finalQuery);
      return { total: subCategories.count, subCategories: subCategories.rows };
    } catch (error) {
      throw error;
    }
  }

  async deleteSubCategory(id: number, userId: number) {
    const transaction = await this.sequelize.transaction();
    try {
      if (!this.helperService.isNotEmpty(id)) {
        ResponseHandler.sendBadRequest(RequireSubCategoryId);
      }

      let subCategory: any = await this.subCategoryModel.findOne({
        where: {
          id
        },
        transaction
      });

      if (!subCategory) {
        ResponseHandler.sendNotFound(SubCategoryDoesNotExist);
      }

      subCategory.updatedByUserId = userId;
      await subCategory.destroy({ transaction });

      await transaction.commit();

      return {
        success: true,
        deletedSubCategory: subCategory.name
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
