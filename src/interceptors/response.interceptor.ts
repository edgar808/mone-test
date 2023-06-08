import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

interface IPagination {
    limit?: number;
    offset?: number;
    total?: number;
}

@Interceptor()
export class ResponseInterceptor implements InterceptorInterface {
    intercept(action: Action, content: any) {
        const pagination: IPagination | null = {};
        if(action.request.originalUrl  === '/api/swagger/json') {
            return  content;
        }

        if (!content) return 'OK'

        if (!content.data) {
            return { success:true, data: content };
        }

        if (content.data  &&  Array.isArray(content.data) ) {
            pagination.total = content.total;

            if (action.request.method === 'GET' ) {
                pagination.limit = parseInt(action.request.query.limit, 10) || 9;
                pagination.offset = parseInt(action.request.query.offset, 10) || 0;
            }else {
                pagination.limit = parseInt(action.request.body.limit, 10) || 9;
                pagination.offset = parseInt(action.request.body.offset, 10) || 0;
            }
            return {
                meta: { pagination },
                success:true,
                data: content.data
            };
        }

        return { success:true, data: content.data };

    }
}

