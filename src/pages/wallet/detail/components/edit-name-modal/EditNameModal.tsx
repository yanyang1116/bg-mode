import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/shadcn-ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/shadcn-ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/shadcn-ui/form';
import { Input } from '@/components/shadcn-ui/input';

import { EDIT_NAME_MODAL } from './const';
import type { EditNameModalProps } from './types';

// 表单验证 schema
const formSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, EDIT_NAME_MODAL.REQUIRED_ERROR)
		.max(
			EDIT_NAME_MODAL.MAX_LENGTH,
			`Name must be ${EDIT_NAME_MODAL.MAX_LENGTH} characters or less`,
		),
});

type FormValues = z.infer<typeof formSchema>;

export function EditNameModal({ isOpen, onClose, currentName, onSave }: EditNameModalProps) {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: currentName,
		},
	});

	// 当 currentName prop 变化时，重置表单
	useEffect(() => {
		form.reset({ name: currentName });
	}, [currentName, form]);

	// 重置表单状态
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset({ name: currentName });
			onClose();
		}
	};

	// 处理表单提交
	const onSubmit = async (values: FormValues) => {
		const trimmedName = values.name.trim();

		if (trimmedName === currentName) {
			onClose();
			return;
		}

		try {
			await onSave(trimmedName);
			toast.success(EDIT_NAME_MODAL.SAVE_SUCCESS);
			onClose();
		} catch (error) {
			console.error('Failed to save wallet name:', error);
			toast.error(EDIT_NAME_MODAL.SAVE_ERROR);
		}
	};

	// 获取表单状态
	const isLoading = form.formState.isSubmitting;
	const currentValue = form.watch('name');

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{EDIT_NAME_MODAL.TITLE}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{EDIT_NAME_MODAL.LABEL}</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={EDIT_NAME_MODAL.PLACEHOLDER}
											maxLength={EDIT_NAME_MODAL.MAX_LENGTH}
											autoFocus
											disabled={isLoading}
											onKeyDown={(e) => {
												if (e.key === 'Enter' && !isLoading) {
													e.preventDefault();
													form.handleSubmit(onSubmit)();
												}
											}}
										/>
									</FormControl>
									<div className="text-xs text-muted-foreground mt-1">
										{currentValue.length}/{EDIT_NAME_MODAL.MAX_LENGTH}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="flex-row gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isLoading}
								className="flex-1"
							>
								{EDIT_NAME_MODAL.CANCEL_BUTTON}
							</Button>
							<Button
								type="submit"
								disabled={isLoading || !currentValue.trim()}
								className="flex-1"
							>
								{isLoading
									? EDIT_NAME_MODAL.SAVING_TEXT
									: EDIT_NAME_MODAL.SAVE_BUTTON}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
