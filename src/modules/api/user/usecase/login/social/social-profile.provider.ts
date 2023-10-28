import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envVariables } from 'src/modules/infrastructure/config/env-config';
import { SocialLoginInput } from '../../../dtos/login/input/social-login.input';
import { LoginType } from '../../../type/login.type';
import { SocialProfile } from '../../../type/social-profile.type';

@Injectable()
export class SocialProfileProvider {
  public async getProfile(input: SocialLoginInput) {
    const { type, token } = input;
    switch (type) {
      case LoginType.KAKAO:
        return this.getKakaoProfile(token);
      case LoginType.NAVER:
        return this.getNaverProfile(token);

      case LoginType.GOOGLE:
        return this.getGoogleProfile(token);
      default:
        throw new Error('Invalid login type');
    }
  }

  private async getKakaoProfile(token: string): Promise<SocialProfile> {
    const result = await axios.get(envVariables.KAKAO_GET_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      params: {
        property_keys: ['kakao_account.email'],
      },
    });

    const profile = {
      email: result.data.kakao_account.email,
      name: result.data.properties.name ?? '카카오 사용자',
      socialId: result.data.id,
    };

    return profile;
  }

  private async getNaverProfile(token: string): Promise<SocialProfile> {
    const result = await axios.get(envVariables.NAVER_GET_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const profile = {
      email: result.data.response.email,
      name: result.data.response.name,
      socialId: result.data.response.id,
    };

    return profile;
  }

  private async getGoogleProfile(token: string): Promise<SocialProfile> {
    const result = await axios.get(envVariables.GOOGLE_GET_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const profile = {
      email: result.data.email,
      name: '구글 사용자',
      socialId: result.data.id,
    };

    return profile;
  }
}
