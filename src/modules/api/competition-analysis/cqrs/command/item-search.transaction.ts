import { Inject, Injectable } from '@nestjs/common';
import { DgLoggerImpl } from 'src/modules/infrastructure/logger/logger.implement';
import { DG_LOGGER } from 'src/symbols';
import { EntityManager } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { KeywordToUser } from '../../entities/keyword/keyword-to-user.entity';
import { SearchKeyword } from '../../entities/keyword/keyword.entity';
import { SearchKeywordItemChannel } from '../../entities/search/search.keyword-item-channel.entity';
import { SearchKeywordItemContent } from '../../entities/search/search.keyword-item-content.entity';
import { SearchKeywordItem } from '../../entities/search/search.keyword-item.entity';

@Injectable()
export class ItemSearchTransaction {
  constructor(
    @Inject(DG_LOGGER)
    private readonly logger: DgLoggerImpl,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute(keyword: SearchKeyword, userCode: string) {
    try {
      let savedKeyword = await this.entityManager.findOne(SearchKeyword, {
        where: {
          name: keyword.name,
        },
        relations: {
          items: {
            channel: true,
            content: true,
          },
          keywordToUsers: true,
        },
      });
      if (!savedKeyword) {
        savedKeyword = await this.entityManager.save(
          SearchKeyword,
          this.entityManager.create(SearchKeyword, keyword),
        );
        const user = await this.entityManager.findOne(User, {
          where: {
            code: userCode,
          },
        });
        await this.entityManager.save(
          KeywordToUser,
          this.entityManager.create(KeywordToUser, {
            keyword: savedKeyword,
            user,
          }),
        );
      } else {
        console.log('키워드가 이미 존재합니다.');
        await this.entityManager.transaction(
          async (transactionManager: EntityManager) => {
            try {
              const user = await transactionManager.findOne(User, {
                where: {
                  code: userCode,
                },
                relations: {
                  keywordToUsers: {
                    keyword: true,
                  },
                },
              });
  
              const keywordToUser = user.keywordToUsers.find(
                (keywordToUser) => keywordToUser.keyword.id === savedKeyword.id,
              );
  
              if (!keywordToUser) {
                await transactionManager.save(
                  KeywordToUser,
                  transactionManager.create(KeywordToUser, {
                    keyword: savedKeyword,
                    user,
                  }),
                );
              }
  
              for (const item of savedKeyword.items) {
                await transactionManager.delete(SearchKeywordItem, {
                  id: item.id,
                });
              }
            } catch (error) {
              this.logger.error(error);
            }
          },
        );
      }
  
      await this.entityManager.transaction(
        async (transactionManager: EntityManager) => {
          try {
            for (const item of keyword.items) {
              const savedItem = await transactionManager.save(
                SearchKeywordItem,
                transactionManager.create(SearchKeywordItem, {
                  ...item,
                  keyword: savedKeyword,
                }),
              );
  
              await transactionManager.save(
                SearchKeywordItemChannel,
                transactionManager.create(SearchKeywordItemChannel, {
                  ...item.channel,
                  keywordItem: savedItem,
                }),
              );
              await transactionManager.save(
                SearchKeywordItemContent,
                transactionManager.create(SearchKeywordItemContent, {
                  ...item.content,
                  keywordItem: savedItem,
                }),
              );
            }
          } catch (error) {
            this.logger.error(error);
          }
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
