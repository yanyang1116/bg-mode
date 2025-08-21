import { PageBack } from '@/components/PageBack';
import { Button } from '@/components/shadcn-ui/button';

export default function NotFoundPage() {
	return (
		<PageBack>
			<div className="flex justify-center mt-40">
				<div className="text-center">
					<h1 className="text-xl font-bold text-foreground mb-4">Page Not Found</h1>
					<p className="text-muted-foreground mb-4 text-sm">
						Sorry, the page you are looking for does not exist
					</p>
					<Button size="sm" onClick={() => (window.location.hash = '#/')}>
						Back to Home
					</Button>
				</div>
			</div>
		</PageBack>
	);
}
