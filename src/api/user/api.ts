import { request } from '@/api/';
import type { InterceptorOptions } from '@/api/types';

import type { Request } from './request.d';
import type { Response } from './response.d';

/**
 * Auth Telegram Login
 */
export const authTelegramLogin = (
	data: Request.AuthTelegramLogin,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<Response.AuthTelegramLogin>> => {
	return request('/public/user/auth/telegram-login', {
		method: 'POST',
		body: JSON.stringify(data),
		...options,
	});
};

/**
 * Get Wallet List
 */
export const walletList = (
	params: Request.WalletList,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<Response.WalletList>> => {
	return request('/private/user/wallet/list', {
		method: 'GET',
		params,
		...options,
	});
};

/**
 * Wallet Withdraw
 */
export const walletWithdraw = (
	data: Request.WalletWithdraw,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<true>> => {
	return request('/private/user/wallet/withdraw', {
		method: 'POST',
		body: JSON.stringify(data),
		...options,
	});
};

/**
 * Get Withdraw History
 */
export const walletWithdrawHistory = (
	params: Request.WalletWithdrawHistory,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<Response.WalletWithdrawHistory>> => {
	return request('/private/user/wallet/withdraw-history', {
		method: 'GET',
		params,
		...options,
	});
};

/**
 * Generate Wallet
 */
export const walletGenerate = (
	data: Request.WalletGenerate,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<Response.WalletGenerate>> => {
	return request('/private/user/wallet/generate', {
		method: 'POST',
		body: JSON.stringify(data),
		...options,
	});
};

/**
 * Set Primary Wallet
 */
export const walletSetPrimary = (
	data: Request.WalletSetPrimary,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<Response.WalletSetPrimary>> => {
	return request('/private/user/wallet/set-primary', {
		method: 'POST',
		body: JSON.stringify(data),
		...options,
	});
};

/**
 * Get Wallet Detail
 */
export const walletDetail = (
	params: Request.WalletDetail,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<Response.WalletDetail>> => {
	return request('/private/user/wallet/detail', {
		method: 'GET',
		params,
		...options,
	});
};

/**
 * Update Wallet
 */
export const walletUpdate = (
	data: Request.WalletUpdate,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<Response.WalletUpdate>> => {
	return request('/private/user/wallet/update', {
		method: 'POST',
		body: JSON.stringify(data),
		...options,
	});
};
