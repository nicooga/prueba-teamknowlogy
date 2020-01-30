import { FormGroup } from '@angular/forms';

/**
 * Interface for Models
 *
 * @export
 * @interface ModelInterface
 */
export interface ModelInterface {
	form: FormGroup;
	init(): void;
}
